package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import y2017.day3

class day3Test {
    @Test
    fun test1() {
        assertEquals(0, day3(1))
    }

    @Test
    fun test2() {
        assertEquals(3, day3(12))
    }

    @Test
    fun test3() {
        assertEquals(2, day3(23))
    }

    @Test
    fun test4() {
        assertEquals(31, day3(1024))
    }
}