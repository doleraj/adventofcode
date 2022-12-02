package y2017

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.File

class day16Test {
    fun parseFile(name: String): List<CharArray> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0, { "" })
        File(fileUri).forEachLine { line -> lines.addAll(line.split(",")) }
        return lines.map { line -> line.toCharArray() }
    }

    @Test
    fun testSpin() {
        val test = arrayOf('a', 'b', 'c', 'd', 'e').toCharArray()
        spin("s3".toCharArray(), test)
        assertEquals("cdeab", test.joinToString(""))
    }

    @Test
    fun testSpin2() {
        val test = arrayOf('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k').toCharArray()
        spin("s10".toCharArray(), test)
        assertEquals("bcdefghijka", test.joinToString(""))
    }

    @Test
    fun testExchange() {
        val test = arrayOf('a', 'b', 'c', 'd', 'e').toCharArray()
        exchange("x3/4".toCharArray(), test)
        assertEquals("abced", test.joinToString(""))
    }

    @Test
    fun testExchange2() {
        val test = arrayOf('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k').toCharArray()
        exchange("x10/1".toCharArray(), test)
        assertEquals("akcdefghijb", test.joinToString(""))
    }

    @Test
    fun testPartner() {
        val test = arrayOf('a', 'b', 'c', 'd', 'e').toCharArray()
        partner("pe/b".toCharArray(), test)
        assertEquals("aecdb", test.joinToString(""))
    }

    @Test
    fun test1() {
        assertEquals("baedc", day16(mutableListOf("s1".toCharArray(), "x3/4".toCharArray(), "pe/b".toCharArray()), 5))
    }

    @Test
    fun testActual() {
        assertEquals("kpfonjglcibaedhm", day16(parseFile("2017/day16ActualInput.txt"), 16))
    }

    @Test
    fun test1Second() {
        assertEquals("ceadb", day16Second(mutableListOf("s1".toCharArray(), "x3/4".toCharArray(), "pe/b".toCharArray()), 5, 2))
    }

    @Test
    fun testActualSecond() {
        assertEquals("kpfonjglcibaedhm", day16Second(parseFile("2017/day16ActualInput.txt"), 16, 1000000000))
    }
}
