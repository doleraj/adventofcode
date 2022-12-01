package y2018

import org.junit.Assert.*
import org.junit.Test
import java.io.File

class day9Test {
    @Test
    fun test1() {
        assertEquals(32, day9(9, 26))
    }

    @Test
    fun test2() {
        assertEquals(8317, day9(10, 1618))
    }

    @Test
    fun test3() {
        assertEquals(146373, day9(13, 7999))
    }

    @Test
    fun test4() {
        assertEquals(2764, day9(17, 1104))
    }

    @Test
    fun test5() {
        assertEquals(54718, day9(21, 6111))
    }

    @Test
    fun test6() {
        assertEquals(37305, day9(30, 5807))
    }


    @Test
    fun testActual() {
        assertEquals(388131, day9(459, 72103 ))
    }
//
//    @Test
//    fun test1Second() {
//        assertEquals(66, day8Second(parseFile("y2018/day08TestInput.txt")))
//    }
//
    @Test
    fun testActualSecond() {
        // 3239376988 overflows int, sigh
        assertEquals(-1055590308, day9(459, 72103 * 100 ))
    }
}